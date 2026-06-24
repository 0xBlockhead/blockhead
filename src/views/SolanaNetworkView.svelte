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
			label: 'CAIP-2',
		},
		{
			label: 'parent network',
		},
		'environment',
	],
	content: {
		dl: [
			[
				{
					label: 'CAIP-2',
				},
				{
					label: 'parent network',
				},
				'environment',
				{
					label: 'latest head snapshot',
				},
				{
					label: 'endpoint count',
				},
			],
			[
				{
					label: 'bounded recent account count',
				},
				{
					label: 'bounded transaction count',
				},
				{
					label: 'validator count',
				},
				{
					label: 'token mint entry points',
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
						label: 'Accounts',
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
				label: 'Consensus & Block Production',
				items: [
					{
						label: 'Validators',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin',
					},
					{
						label: 'token mints from selectors or parsed token-account state',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
					},
					{
						label: 'source coverage',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork>
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
	entityType={EntityType.SolanaNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
