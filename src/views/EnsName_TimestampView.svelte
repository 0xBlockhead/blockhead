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
				label: 'name',
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
						label: 'name',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'resolved actor',
					},
					{
						label: 'resolver contract',
					},
					{
						label: 'owner',
					},
					{
						label: 'subdomain count',
					},
				],
				[
					{
						label: 'text/coin record key counts',
					},
					{
						label: 'TTL',
					},
					{
						label: 'migration state',
					},
					{
						label: 'created/expiry dates',
					},
					{
						label: 'subgraph id',
					},
					{
						label: 'block number',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Name',
					items: [
						{
							label: 'parent ENS name',
						},
					],
				},
				{
					label: 'Registry state',
					items: [
						{
							label: 'owner',
						},
						{
							label: 'resolver',
						},
						{
							label: 'resolved-address summary',
						},
						{
							label: 'TTL',
						},
						{
							label: 'migration',
						},
					],
				},
				{
					label: 'Registration',
					items: [
						{
							label: 'created/expiry/subgraph id',
						},
					],
				},
				{
					label: 'Record discovery',
					items: [
						{
							label: 'text record keys',
						},
						{
							label: 'coin types',
						},
						{
							label: 'links to concrete resolver record observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'live RPC resolver calls',
						},
						{
							label: 'subgraph registration/resolver event payload',
						},
						{
							label: 'metadata service payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsName_Timestamp>
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
	entityType={EntityType.EnsName_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
