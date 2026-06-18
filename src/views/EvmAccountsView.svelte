<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { type as arktype } from 'arktype'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { writeLocalWatchedEvmAccount } from '$/collections/localMutations.ts'
	import { appClient, select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		title = 'Watched accounts',
		id,
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			id: string
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	

	let watchAddressInput = $state('')
	let watchAddressError = $state<string | undefined>(
		undefined,
	)


	// Actions
	const watchAccount = () => {
		const parsedAddress = EvmAddress(watchAddressInput.trim())
		if (parsedAddress instanceof arktype.errors) {
			watchAddressError = 'Enter a 20-byte EVM address.'
			return
		}

		writeLocalWatchedEvmAccount(appClient, {
			address: parsedAddress,
		})
		watchAddressInput = ''
		watchAddressError = undefined
	}


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmAccount}
	{id}
	bind:open
	{collapsible}
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Watched accounts are execution-layer addresses explicitly added to this facet.
		</p>
		<p>
			Empty lists usually mean nothing is being watched yet or the parent entity has not loaded its relations fully.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No watched accounts in this evmAccounts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<form
				data-card
				data-column="gap-2"
				onsubmit={(event) => {
					event.preventDefault()
					watchAccount()
				}}
			>
				<label for={`${id}-watch-address`}>
					Watch account
				</label>

				<div data-row="align-center">
					<input
						id={`${id}-watch-address`}
						type="text"
						bind:value={watchAddressInput}
						placeholder="0xd8da6bf26964af9d7eed9e403e826090792bed6a"
					/>

					<button type="submit">
						Add
					</button>
				</div>

				{#if watchAddressError !== undefined}
					<p data-text="muted">
						{watchAddressError}
					</p>
				{/if}
			</form>

			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Local_Internal,
						],
					})}
				placeholderText="Loading watched accounts…"
			>
				{#snippet children(actors)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmAccount}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(evmAccount) => stringify(evmAccount.entitySelector)}
				getSortValue={(evmAccount) => evmAccount.entitySelector.address.toLowerCase()}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText="Loading watched accounts…"
				items={actors.entities}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No watched accounts in this evmAccounts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const aid = item.entitySelector}
					<EvmAccountView
						selector={aid}
						href={resolve('/account/[address]', {
							address: aid.address,
						})}
						layout={EntityLayout.Summary}

						title="Account"
					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
