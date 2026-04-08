<script lang="ts">
	// Types/constants
	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/collections/$collections.ts'
	import TanstackDbCollectionCacheSection from '$/components/TanstackDbCollectionCacheSection.svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/$schema.ts'
</script>


<main data-column>
	<section data-card>
		<h2>Collection cache (TanStack DB)</h2>
		<p class="collection-overview-lead">
			Live view of rows already held in each collection store (no broad fetch). Nested
			<code>details</code>
			per
			<code>schema</code>
			entry; field collections follow each definition’s
			<code>fields</code>
			.
		</p>

		{#each schema as entityDefinition (entityDefinition.entityType)}
			<details
				data-card
				class="collection-domain"
			>
				<summary>
					<h2>
						<code>{entityDefinition.entityType}</code>
					</h2>

					{entityDefinition.label} entity collection
				</summary>

				<div data-column>
					<TanstackDbCollectionCacheSection
						collection={entityCollectionByEntityType[entityDefinition.entityType]}
						summaryLabel="Items"
						summaryLevel="h3"
						detailsClass="collection-domain"
						rowKey={(row, _index) => (
							[
								String(row[EntityMetaKey.Source] ?? ''),
								String(row[EntityMetaKey.IdKey] ?? ''),
							].join('\0')
						)}
					/>

					{#each entityDefinition.fields as field (field.name)}
						<TanstackDbCollectionCacheSection
							collection={entityFieldCollections[entityDefinition.entityType][field.name]}
							summaryLabel={field.name}
							summaryAsCode
							summaryLevel="h4"
							detailsClass="collection-field"
							contentColumn
							rowKey={(row, index) => (
								[
									String(entityDefinition.entityType),
									String(field.name),
									String(row[EntityMetaKey.Source] ?? ''),
									String(row[EntityMetaKey.ParentIdKey] ?? ''),
									String(index),
								].join('\0')
							)}
						/>
					{/each}
				</div>
			</details>
		{/each}
	</section>
</main>
