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
		'realm',
		'category',
		'number',
	],
	content: {
		dl: [
			[
				'realm',
				'category',
				'number',
				{
					label: 'realm/category labels',
				},
				{
					label: 'title',
				},
				{
					label: 'status',
				},
				{
					label: 'document category',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Body',
				items: [
					{
						label: 'rendered proposal markdown/rst/mediawiki/document text',
					},
				],
			},
			{
				label: 'Proposal family',
				items: [
					{
						label: 'realm/category filter labels derived from fields',
					},
				],
			},
			{
				label: 'Linked upgrades',
				items: [
					{
						label: 'upgrade rows only when an explicit catalog/source maps the proposal',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'upstream repository/API path',
					},
					{
						label: 'file path or synthetic index',
					},
					{
						label: 'fetch freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposal>
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
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
