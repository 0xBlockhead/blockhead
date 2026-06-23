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
				label: 'token id',
			},
			{
				label: 'version',
			},
			{
				label: 'mint',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'token id',
					},
					{
						label: 'version',
					},
					{
						label: 'mint',
					},
					'unit',
					'memo',
					{
						label: 'proof count',
					},
					{
						label: 'total amount',
					},
					{
						label: 'imported time',
					},
					{
						label: 'redeemed time',
					},
					'status',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Proofs',
					items: [
						{
							label: 'BlockheadCashuProof list',
						},
					],
				},
				{
					label: 'Encoded token',
					items: [
						{
							label: 'redacted token string with local reveal/copy controls',
						},
					],
				},
				{
					label: 'Mint',
					items: [
						{
							label: 'CashuMintView',
						},
					],
				},
				{
					label: 'Import/redeem',
					items: [
						{
							label: 'local lifecycle',
						},
						{
							label: 'errors when captured',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuToken>
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
	entityType={EntityType.BlockheadCashuToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
