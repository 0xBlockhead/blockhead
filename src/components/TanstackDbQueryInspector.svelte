<script lang="ts">
	import { useLiveQuery } from '@tanstack/svelte-db'

	import NumberValue from '$/views/NumberValue.svelte'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'
	import type { JsonValue } from '$/typescript/JsonValue.ts'

	const entityQueryByEntityType = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			useLiveQuery((queryBuilder) => (
				queryBuilder
					.from({ entity: entityCollectionByEntityType[entityDefinition.entityType] })
					.select(({ entity }) => ({ entity }))
			)),
		] as const),
	)

	const entityFieldQueryByEntityType = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			Object.fromEntries(
				entityDefinition.fields.map((field) => [
					field.name,
					useLiveQuery((queryBuilder) => (
						queryBuilder
							.from({
								entityField: entityFieldCollections[entityDefinition.entityType][field.name],
							})
							.select(({ entityField }) => ({ entityField }))
					)),
				] as const),
			),
		] as const),
	)

	const bigintSafeReplacer = (_key: string, value: JsonValue) => (
		typeof value === 'bigint' ? value.toString() : value
	)
</script>


<main data-column>
	<section data-card>
		<h2>Local entity and field data</h2>
		<p class="collection-overview-lead">
			Grouped by type. Expand a type to see stored rows and each related field group.
		</p>

		{#each schema as entityDefinition (entityDefinition.entityType)}
			{@const entityQuery = entityQueryByEntityType[entityDefinition.entityType]}

			<details
				data-card
				class="collection-domain"
			>
				<summary>
					<h2>
						<code>{entityDefinition.entityType}</code>
					</h2>

					{entityDefinition.label}
				</summary>

				<div data-column>
					<details
						data-card
						class="collection-domain"
					>
						<summary>
							<h3>
								Items
								{#if entityQuery.data?.length}(<NumberValue
									value={entityQuery.data.length}
									options={{ maximumFractionDigits: 0 }}
								/>){/if}
							</h3>
						</summary>

						{#if entityQuery.isLoading}
							<p>Loading…</p>
						{:else if entityQuery.isError}
							<p>Error</p>
						{:else if entityQuery.data.length}
							<ul class="collection-entities">
								{#each entityQuery.data as entityRow (
									[
										String(entityRow.entity[EntityMetaKey.Source] ?? ''),
										String(entityRow.entity[EntityMetaKey.IdKey] ?? ''),
									].join('\0')
								)}
									<li>
										<pre data-card>{JSON.stringify(
											entityRow.entity,
											bigintSafeReplacer,
											2,
										)}</pre>
									</li>
								{/each}
							</ul>
						{:else}
							<p>No data</p>
						{/if}
					</details>

					{#each entityDefinition.fields as field (field.name)}
						{@const entityFieldQuery = entityFieldQueryByEntityType[entityDefinition.entityType][field.name]}

						<details
							data-card
							class="collection-field"
						>
							<summary>
								<h4>
									<code>{field.name}</code>
									{#if !entityFieldQuery.isLoading}
										(<NumberValue
											value={entityFieldQuery.data.length}
											options={{ maximumFractionDigits: 0 }}
										/>)
									{/if}
								</h4>
							</summary>

							<div data-column>
								{#if entityFieldQuery.isLoading}
									<p>Loading…</p>
								{:else if entityFieldQuery.isError}
									<p>Error</p>
								{:else if entityFieldQuery.data.length}
									<ul class="collection-entity-fields">
										{#each entityFieldQuery.data as fieldRow, index (
											[
												String(entityDefinition.entityType),
												String(field.name),
												String(fieldRow.entityField[EntityMetaKey.Source] ?? ''),
												String(fieldRow.entityField[EntityMetaKey.ParentIdKey] ?? ''),
												String(index),
											].join('\0')
										)}
											<li>
												<pre data-card>{JSON.stringify(
													fieldRow.entityField,
													bigintSafeReplacer,
													2,
												)}</pre>
											</li>
										{/each}
									</ul>
								{:else}
									<p>No data</p>
								{/if}
							</div>
						</details>
					{/each}
				</div>
			</details>
		{/each}
	</section>
</main>


<style>
	pre {
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.35;
		max-height: 80vh;
	}
</style>
