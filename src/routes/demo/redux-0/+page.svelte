<script lang="ts">
	// Types/constants
	import { useLiveQuery } from '@tanstack/svelte-db'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'


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


	// Components
	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'

	import NumberValue from '$/views/NumberValue.svelte'
</script>


<main data-column>
	<section data-card>
		<h2>Collection contents (entities + entityFields)</h2>
		<p class="collection-overview-lead">
			Nested
			<code>details</code>
			per
			<code>schema</code>
			entry; field collections follow each definition’s
			<code>fields</code>
			.
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

					{entityDefinition.label} entity collection
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
								{#each entityQuery.data as item, index (
									[
										String(item.entity[EntityMetaKey.Source] ?? ''),
										String(item.entity[EntityMetaKey.IdKey] ?? ''),
									].join('\0')
								)}
									<li>
										<pre data-card>{JSON.stringify(
											item.entity,
											(_key, inner) => (typeof inner === 'bigint' ?
												inner.toString()
											:
												inner),
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
										{#each entityFieldQuery.data as item, index (
											[
												String(entityDefinition.entityType),
												String(field.name),
												String(item.entityField[EntityMetaKey.Source] ?? ''),
												String(item.entityField[EntityMetaKey.ParentIdKey] ?? ''),
												String(index),
											].join('\0')
										)}
											<li>
												<pre data-card>{JSON.stringify(
													item.entityField,
													(_key, inner) => (typeof inner === 'bigint' ?
														inner.toString()
													:
														inner),
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
