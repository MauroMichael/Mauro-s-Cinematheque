import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import readXlsxFile from 'read-excel-file/node';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { Film } from '../modules/films/entities';
import { Format, Status } from '../modules/films/enum';

type FilmColumn = 'name' | 'year' | 'length' | 'country' | 'genre' | 'sector' | 'code';

const HEADER_TO_FIELD: Record<string, FilmColumn> = {
  nombre: 'name',
  ano: 'year',
  duracion: 'length',
  pais: 'country',
  genero: 'genre',
  sector: 'sector',
  codigo: 'code',
};

const SHEET_TO_FORMAT: Record<string, Format> = {
  dvd: Format.DVD,
  'blu ray': Format.BLURAY,
  vhs: Format.VHS,
  'comp dvd': Format.COMPILED_DVD,
  'comp blu ray': Format.COMPILED_BLURAY,
};

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function toOptionalString(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized.length > 0 ? normalized : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const normalized = String(value).replace(',', '.').trim();
  if (normalized.length === 0) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolveFormat(sheetName: string): Format | undefined {
  return SHEET_TO_FORMAT[normalizeText(sheetName)];
}

function getHeaderRowIndex(rows: unknown[][]): number {
  const maxRowsToInspect = Math.min(rows.length, 10);

  for (let index = 0; index < maxRowsToInspect; index += 1) {
    const row = rows[index];
    const matches = row.reduce<number>((count, cell) => {
      return HEADER_TO_FIELD[normalizeText(cell)] ? count + 1 : count;
    }, 0);

    if (matches >= 2) {
      return index;
    }
  }

  return -1;
}

async function importSheet(
  repository: Repository<Film>,
  sheetName: string,
  rows: unknown[][],
): Promise<{ inserted: number; skipped: number }> {
  const format = resolveFormat(sheetName);
  if (!format) {
    console.warn(`Hoja ignorada por formato desconocido: ${sheetName}`);
    return { inserted: 0, skipped: 0 };
  }

  if (rows.length === 0) {
    return { inserted: 0, skipped: 0 };
  }

  const headerRowIndex = getHeaderRowIndex(rows);
  if (headerRowIndex === -1) {
    throw new Error(
      `La hoja ${sheetName} no tiene una fila de encabezados reconocible.`,
    );
  }

  const headerRow = rows[headerRowIndex];
  const columnMap = new Map<number, FilmColumn>();

  headerRow.forEach((header, index) => {
    const field = HEADER_TO_FIELD[normalizeText(header)];
    if (field) {
      columnMap.set(index, field);
    }
  });

  if (!Array.from(columnMap.values()).includes('name')) {
    throw new Error(`La hoja ${sheetName} no tiene una columna NOMBRE reconocible.`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const row of rows.slice(headerRowIndex + 1)) {
    const draft: Partial<Film> = {
      format,
      status: Status.ACTIVE,
    };

    row.forEach((cell, index) => {
      const field = columnMap.get(index);
      if (!field) {
        return;
      }

      if (field === 'year' || field === 'length' || field === 'code') {
        draft[field] = toOptionalNumber(cell) as never;
        return;
      }

      draft[field] = toOptionalString(cell) as never;
    });

    if (!draft.name) {
      skipped += 1;
      continue;
    }

    const query = repository
      .createQueryBuilder('films')
      .where('films.name = :name', { name: draft.name });

    if (draft.sector === undefined) {
      query.andWhere('films.sector IS NULL');
    } else {
      query.andWhere('films.sector = :sector', { sector: draft.sector });
    }

    if (draft.code === undefined) {
      query.andWhere('films.code IS NULL');
    } else {
      query.andWhere('films.code = :code', { code: draft.code });
    }

    const alreadyExists = await query.getExists();

    if (alreadyExists) {
      skipped += 1;
      continue;
    }

    const entity = repository.create(draft);
    await repository.save(entity);
    inserted += 1;
  }

  return { inserted, skipped };
}

async function bootstrap() {
  const filePath = process.argv[2] || process.env.EXCEL_PATH;

  if (!filePath) {
    throw new Error(
      'Debes indicar la ruta del Excel. Ejemplo: npm run import:films -- "C:\\ruta\\archivo.xlsx"',
    );
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const repository = app.get<Repository<Film>>(getRepositoryToken(Film));
    const workbook = await readXlsxFile(filePath);

    let totalInserted = 0;
    let totalSkipped = 0;

    for (const { sheet, data } of workbook) {
      const result = await importSheet(repository, sheet, data as unknown[][]);
      totalInserted += result.inserted;
      totalSkipped += result.skipped;

      console.log(
        `Hoja ${sheet}: ${result.inserted} insertadas, ${result.skipped} omitidas.`,
      );
    }

    console.log(
      `Importacion finalizada. Insertadas: ${totalInserted}. Omitidas: ${totalSkipped}.`,
    );
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Fallo la importacion de peliculas:', error);
  process.exit(1);
});
