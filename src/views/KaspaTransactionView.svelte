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
				label: 'network',
			},
			{
				label: 'transaction id',
			},
			'version',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'transaction id',
					},
					'version',
					{
						label: 'subnetwork id',
					},
					'mass',
					{
						label: 'payload length',
					},
					{
						label: 'block hash count',
					},
					{
						label: 'accepted status',
					},
					{
						label: 'accepting block count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'UTXO inputs',
					items: [
						{
							label: 'transaction input rows',
						},
					],
				},
				{
					label: 'UTXO outputs',
					items: [
						{
							label: 'transaction output rows',
						},
					],
				},
				{
					label: 'Acceptances',
					items: [
						{
							label: 'accepting block rows',
						},
					],
				},
				{
					label: 'DAG blocks',
					items: [
						{
							label: 'containing block hashes',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'payload hash',
						},
						{
							label: 'length',
						},
						{
							label: 'decoded payload preview when source provides bytes',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'node/indexer transaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaTransaction>
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
	entityType={EntityType.KaspaTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
