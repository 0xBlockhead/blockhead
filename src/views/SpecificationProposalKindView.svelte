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
		'label',
	],
	content: {
		dl: [
			[
				'realm',
				'category',
				'label',
				{
					label: 'plural label',
				},
				'slug',
				'$$proposals',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Realm',
				items: [
					'$specificationRealm',
				],
			},
			{
				label: 'Proposals',
				items: [
					{
						label: 'SpecificationProposal rows in this family',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'checked-in proposal category catalog',
					},
					{
						label: 'source repositories for proposals',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'proposals',
			label: 'proposals',
			field: '$$proposals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposalKind>
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
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
