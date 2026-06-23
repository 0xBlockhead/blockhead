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
				label: 'allowance',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'allowance',
					},
					{
						label: 'observation time',
					},
					'source',
					'amount',
					{
						label: 'approved-for-all flag',
					},
					{
						label: 'deleted/absent flag',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Allowance',
					items: [
						{
							label: 'parent Hedera allowance relation',
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
					label: 'Spender',
					items: [
						{
							label: 'spender Hedera account',
						},
					],
				},
				{
					label: 'Token/NFT',
					items: [
						{
							label: 'linked Hedera token or NFT through allowance',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw account allowance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaAllowance_Timestamp>
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
	entityType={EntityType.HederaAllowance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
