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
				label: 'object id',
			},
			{
				label: 'latest type/owner/version/digest summary',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'object id',
					},
					{
						label: 'latest type/owner/version/digest summary',
					},
					{
						label: 'version count',
					},
					{
						label: 'dynamic-field count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Versions',
					items: [
						{
							label: 'object version rows',
						},
					],
				},
				{
					label: 'Dynamic fields',
					items: [
						{
							label: 'dynamic-field edge rows',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'Sui account or parent object when owner selector resolves',
						},
					],
				},
				{
					label: 'Contents',
					items: [
						{
							label: 'latest structured JSON via object version',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'sui_getObject',
						},
						{
							label: 'suix_getOwnedObjects',
						},
						{
							label: 'or GraphQL object payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiObject>
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
	entityType={EntityType.SuiObject}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
