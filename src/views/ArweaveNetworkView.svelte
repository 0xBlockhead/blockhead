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
			label: 'latest height',
		},
		{
			label: 'gateway/source coverage',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'latest network timestamp height/health',
				},
				{
					label: 'configured access coverage',
				},
				{
					label: 'block count',
				},
				{
					label: 'transaction count',
				},
				{
					label: 'resource count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest status',
				items: [
					{
						label: 'latest source-local network observation',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'block rows by height or independent hash',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transaction rows by transaction id',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'gateway resource rows by transaction id/path',
					},
				],
			},
			{
				label: 'Sources',
				items: [
					{
						label: 'configured access endpoint/node endpoints',
					},
					{
						label: 'GraphQL transaction/block metadata',
					},
					{
						label: 'archival/deep-history notes',
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveNetwork>
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
	entityType={EntityType.ArweaveNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
