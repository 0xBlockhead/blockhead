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
			'kind',
			{
				label: 'asset key',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'kind',
					{
						label: 'asset key',
					},
					{
						label: 'coin id',
					},
					'name',
					'symbol',
					'decimals',
					{
						label: 'icon',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Formats',
					items: [
						{
							label: 'format-support observations grouped by standard/profile',
						},
					],
				},
				{
					label: 'Supply',
					items: [
						{
							label: 'ledger-coordinate and provider-clocked supply rows',
						},
					],
				},
				{
					label: 'Objects/classes',
					items: [
						{
							label: 'class/object rows when source-backed',
						},
					],
				},
				{
					label: 'Metadata',
					items: [
						{
							label: 'registry/catalog display metadata and media refs',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetInstance>
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
	entityType={EntityType.AssetInstance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
