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
		'$nft',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$nft',
				'timestampMs',
				'source',
				'$owner',
				'ownerAccountId',
			],
			[
				'deleted',
				'spenderAccountId',
				'modifiedTimestamp',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'NFT',
				items: [
					{
						label: 'parent Hedera NFT serial',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'owner Hedera account',
					},
				],
			},
			{
				label: 'Token',
				items: [
					{
						label: 'parent Hedera token',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'token transfers near the same observation',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw NFT serial payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNft_Timestamp>
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
	entityType={EntityType.HederaNft_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
