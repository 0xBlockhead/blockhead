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
				label: 'parent network',
			},
			{
				label: 'latest head snapshot',
			},
			{
				label: 'REST endpoint count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'parent network',
					},
					{
						label: 'latest head snapshot',
					},
					{
						label: 'REST endpoint count',
					},
				],
				[
					{
						label: 'bounded validator count',
					},
					{
						label: 'bounded governance proposal count',
					},
					{
						label: 'denom/account/module entry points',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Execution',
					items: [
						{
							label: 'Blocks',
						},
						{
							label: 'Transactions',
						},
						{
							label: 'Network snapshots',
						},
						{
							label: 'Endpoints',
						},
					],
				},
				{
					label: 'Consensus & Governance',
					items: [
						{
							label: 'Validators',
						},
						{
							label: 'Validator snapshots',
						},
						{
							label: 'Governance proposals',
						},
					],
				},
				{
					label: 'Accounts & Modules',
					items: [
						{
							label: 'Accounts',
						},
						{
							label: 'Modules',
						},
						{
							label: 'CosmWasm contracts',
						},
					],
				},
				{
					label: 'Assets',
					items: [
						{
							label: 'native denom metadata',
						},
						{
							label: 'account balance snapshots',
						},
					],
				},
				{
					label: 'Source coverage',
					items: [
						{
							label: 'Cosmos SDK REST endpoint',
						},
						{
							label: 'Cosmos Chain Registry catalog seeds',
						},
						{
							label: 'CometBFT REST when wired',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork>
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
	entityType={EntityType.CosmosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
