import { Item } from '@directus/shared/types';
import { Knex } from 'knex';
import { JsonHelperDefault } from './default';

/**
 * We may want a fallback to support wildcard queries (will be super slow unfortunately)
 */
export class JsonHelperMariaDB extends JsonHelperDefault {
	preProcess(dbQuery: Knex.QueryBuilder, table: string): void {
		dbQuery
			.select(
				this.nodes.map((node) => {
					const q = this.knex.raw('?', [node.jsonPath]).toQuery();
					return this.knex.raw(`JSON_EXTRACT(??.??, ${q}) as ??`, [table, node.name, node.fieldKey]);
				})
			)
			.from(table);
	}
	postProcess(items: Item[]): void {
		this.postProcessParseJSON(items);
	}
}