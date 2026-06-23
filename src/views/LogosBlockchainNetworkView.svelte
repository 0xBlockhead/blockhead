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
				label: 'linked Network',
			},
			{
				label: 'latest height',
			},
			{
				label: 'latest mode',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'latest height/slot',
					},
					{
						label: 'latest tip/LIB',
					},
					{
						label: 'latest mode',
					},
					{
						label: 'source coverage',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Consensus status',
					items: [
						{
							label: 'latest timestamped consensus observation',
						},
					],
				},
				{
					label: 'Status history',
					items: [
						{
							label: 'timestamped consensus observations',
						},
					],
				},
				{
					label: 'Connected nodes',
					items: [
						{
							label: 'BlockheadLogosBlockchainNodeState rows',
						},
					],
				},
				{
					label: 'Wallet keys',
					items: [
						{
							label: 'BlockheadLogosBlockchainWalletKeyState rows known to connected nodes',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'checked-in network constants',
						},
						{
							label: 'Logos Blockchain local REST API',
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
			selection: EntityProxyResource<typeof schema, EntityType.LogosBlockchainNetwork>
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
	entityType={EntityType.LogosBlockchainNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
