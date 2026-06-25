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
			label: 'registry server name/repository',
		},
		'label',
	],
	content: {
		dl: [
			[
				'registryServerName',
				'repositoryUrl',
				{
					label: 'repository source/id',
				},
			],
			[
				'repositorySubfolder',
				'websiteUrl',
				'label',
				'description',
				'license',
			],
			[
				{
					label: 'version refs',
				},
				{
					label: 'document refs',
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
						label: 'McpServerPackageVersion list',
					},
				],
			},
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'repository source/id/subfolder',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'versions',
			label: 'versions',
			field: '$$versions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpServerPackage>
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
	entityType={EntityType.McpServerPackage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
