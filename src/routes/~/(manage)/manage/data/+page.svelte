<script lang="ts">
	// Types/constants
	import { EntityMetaKey, entityFieldDefinitions } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { enabledSources } from '$/sources/index.ts'
	import { appClient } from '$/routes/+layout.svelte'
	import { useCollectionCache } from './collectionCache.svelte.ts'


	const collectionEntityDefinitions = schema.map((entityDefinition) => ({
		entityType: entityDefinition.entityType,
		label: entityDefinition.label,
		fields: entityFieldDefinitions(entityDefinition).map((field) => ({
			cacheKey: `${entityDefinition.entityType}\0${field.name}`,
			name: field.name,
		})),
	}))

	const entityCaches = Object.fromEntries(
		schema.map((entityDefinition) => [
			entityDefinition.entityType,
			useCollectionCache(appClient.entityCollections[entityDefinition.entityType]),
		]),
	)

	const fieldCaches = Object.fromEntries(
		schema.flatMap((entityDefinition) => (
			entityFieldDefinitions(entityDefinition).map((field) => [
				`${entityDefinition.entityType}\0${field.name}`,
				useCollectionCache(
					appClient.entityFieldCollections[entityDefinition.entityType][field.name],
				),
			])
		)),
	)


	// Components
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<main data-column>
	<section data-card>
		<h2>Resolver sources</h2>
		<p class="collection-overview-lead">
			Which <code>Source</code> values are currently enabled (env gates satisfied in
			<code>src/sources/index.ts</code>). Off means that resolver module is not registered.
		</p>
		<ul>
			{#each [...Object.values(Source)].sort((a, b) => a.localeCompare(b)) as source (source)}
				<li>
					<code>{source}</code> · {enabledSources.has(source) ? 'on' : 'off'}
				</li>
			{/each}
		</ul>
	</section>
	<section data-card>
		<h2>Collection cache (TanStack DB)</h2>
		<p class="collection-overview-lead">
			Rows already loaded in this session (not a full refetch). Expand a type to see items and
			each related field group.
		</p>

		{#each collectionEntityDefinitions as entityDefinition (entityDefinition.entityType)}
			{@const entityCache = entityCaches[entityDefinition.entityType]}

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
								(<NumberValue
									value={entityCache.rows.length}
									options={{ maximumFractionDigits: 0 }}
								/>)
								·
								<code>{entityCache.status}</code>
							</h3>
						</summary>

						{#if entityCache.status === 'error'}
							<p>Error</p>
						{:else if entityCache.rows.length}
							<ul class="collection-entities">
								{#each entityCache.rows as row, index (
									[
										String(row[EntityMetaKey.Source] ?? ''),
										String(row[EntityMetaKey.SelectorKey] ?? ''),
									].join('\0')
								)}
									<li>
										<pre data-card>{JSON.stringify(
											row,
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
							<p>No cached rows</p>
						{/if}
					</details>

					{#each entityDefinition.fields as field, fieldIndex (
						[
							String(entityDefinition.entityType),
							String(field.name),
							String(fieldIndex),
						].join('\0')
					)}
						{@const fieldCache = fieldCaches[field.cacheKey]}

						<details
							data-card
							class="collection-field"
						>
							<summary>
								<h4>
									<code>{field.name}</code>
									(<NumberValue
										value={fieldCache.rows.length}
										options={{ maximumFractionDigits: 0 }}
									/>)
									·
									<code>{fieldCache.status}</code>
								</h4>
							</summary>

							<div data-column>
								{#if fieldCache.status === 'error'}
									<p>Error</p>
								{:else if fieldCache.rows.length}
									<ul class="collection-entity-fields">
										{#each fieldCache.rows as row, index (
											[
												String(entityDefinition.entityType),
												String(field.name),
												String(row[EntityMetaKey.Source] ?? ''),
												String(row[EntityMetaKey.ParentSelectorKey] ?? ''),
												String(index),
											].join('\0')
										)}
											<li>
												<pre data-card>{JSON.stringify(
													row,
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
									<p>No cached rows</p>
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
