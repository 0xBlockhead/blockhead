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
				label: 'package lineage',
			},
			{
				label: 'package id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'package lineage',
					},
					{
						label: 'package id',
					},
					'version',
					'digest',
					{
						label: 'previous package id',
					},
					{
						label: 'upgrade policy',
					},
					{
						label: 'module count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Package',
					items: [
						{
							label: 'package lineage when resolved',
						},
					],
				},
				{
					label: 'Module identities',
					items: [
						{
							label: 'Move module rows',
						},
					],
				},
				{
					label: 'Module observations',
					items: [
						{
							label: 'module bytecode/ABI/source observations for package version',
						},
					],
				},
				{
					label: 'Publishing transaction',
					items: [
						{
							label: 'Sui transaction when source object changes identify it',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'sui_getObject/GraphQL package object',
						},
						{
							label: 'published-object payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiPackageVersion>
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
	entityType={EntityType.SuiPackageVersion}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
