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
				label: 'observation time',
			},
			{
				label: 'latest height',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'observation time',
					},
					'source',
					'reachable',
					{
						label: 'gateway origin',
					},
					{
						label: 'latest height',
					},
					{
						label: 'latest/current block hash',
					},
				],
				[
					{
						label: 'network id',
					},
					{
						label: 'peer count',
					},
					{
						label: 'queued transaction count',
					},
					{
						label: 'GraphQL cursor',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent Arweave network',
						},
					],
				},
				{
					label: 'Head',
					items: [
						{
							label: 'latest height/hash fields from gateway info or newest block metadata',
						},
					],
				},
				{
					label: 'Source window',
					items: [
						{
							label: 'GraphQL cursor or REST info payload freshness',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'gateway/node info response',
						},
						{
							label: 'GraphQL blocks sorted by height',
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveNetwork_Timestamp>
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
	entityType={EntityType.ArweaveNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
