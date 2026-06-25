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
		'$transaction',
		'certificateIndex',
		'certificateKind',
	],
	content: {
		dl: [
			[
				'$transaction',
				'certificateIndex',
				'certificateKind',
				'$stakeCredential',
				'$stakePool',
			],
			[
				'$drep',
				'poolId',
				'rewardAddress',
				'depositLovelace',
				'epoch',
			],
			[
				{
					label: 'metadata URL/hash',
				},
				{
					label: 'payload summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent Cardano transaction',
					},
				],
			},
			{
				label: 'Stake credential',
				items: [
					{
						label: 'linked Cardano stake credential',
					},
				],
			},
			{
				label: 'Stake pool',
				items: [
					{
						label: 'linked Cardano stake pool',
					},
				],
			},
			{
				label: 'DRep',
				items: [
					{
						label: 'linked Cardano DRep',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'certificate JSON/CBOR fields',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer certificate payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoCertificate>
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
	entityType={EntityType.CardanoCertificate}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
