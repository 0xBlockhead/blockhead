<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'version/hash',
			},
			{
				label: 'kind',
			},
			'sender',
		],
		content: {
			dl: [
				[
					{
						label: 'version/hash',
					},
					{
						label: 'kind',
					},
					'sender',
					{
						label: 'latest success/vm status',
					},
					{
						label: 'latest gas',
					},
					{
						label: 'latest timestamp',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest result',
					items: [
						{
							label: 'latest ledger-version/source transaction observation',
						},
					],
				},
				{
					label: 'Result history',
					items: [
						{
							label: 'transaction result observations',
						},
					],
				},
				{
					label: 'State changes',
					items: [
						{
							label: 'state changes emitted by this transaction',
						},
					],
				},
				{
					label: 'Events',
					items: [
						{
							label: 'events emitted by this transaction',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'entry function/script payload JSON',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'fullnode/indexer version or hash lookup',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AptosTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.AptosTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
