<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BittensorNeuron>, 'prefetched'> = $props()

	const subnet = $derived(selection.entitySelector.$subnet)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNeuron}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.uid)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/subnet/[netuid=nonNegativeInteger]/(bittensorSubnet)/neuron/[uid=nonNegativeInteger]',
				{
					network: (
						subnet.$network.caip2 !== undefined ?
							caip2StringFromValue(subnet.$network.caip2)
						:
							subnet.$network.slug
					),
					netuid: String(subnet.netuid),
					uid: String(selection.entitySelector.uid),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.uid}
		/>
	{/snippet}

	{#snippet Value()}
		<BittensorSubnetView
			selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Subnet</dt>
				<dd>
					<BittensorSubnetView
						selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>UID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.uid}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
