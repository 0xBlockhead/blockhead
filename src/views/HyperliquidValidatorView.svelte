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
				label: 'validator address',
			},
			{
				label: 'latest name',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'validator address',
					},
					{
						label: 'latest observed name/signer',
					},
					{
						label: 'latest commission/stake/activity summary',
					},
					{
						label: 'observation count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Observations',
					items: [
						{
							label: 'timestamped validator summary observations',
						},
					],
				},
				{
					label: 'Latest signer',
					items: [
						{
							label: 'Hyperliquid account from latest signer observation',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Hyperliquid network',
						},
					],
				},
				{
					label: 'Produced blocks',
					items: [
						{
							label: 'HyperEVM blocks when source context provides validator/block linkage',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'validatorSummaries payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidValidator>
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
	entityType={EntityType.HyperliquidValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
