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
			label: 'package/version or artifact',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'package',
				},
				'version',
				{
					label: 'artifact',
				},
			],
			[
				{
					label: 'release date',
				},
				{
					label: 'registry status',
				},
				{
					label: 'published at',
				},
				{
					label: 'latest',
				},
			],
			[
				{
					label: 'package registry type/base URL',
				},
				{
					label: 'package identifier',
				},
				{
					label: 'runtime hint',
				},
				{
					label: 'transport kind',
				},
			],
			[
				{
					label: 'document refs',
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
						label: 'McpServerPackage',
					},
				],
			},
			{
				label: 'Artifact',
				items: [
					{
						label: 'AiArtifact',
					},
				],
			},
			{
				label: 'Packages',
				items: [
					{
						label: 'packages JSON',
					},
					{
						label: 'package/runtime arguments',
					},
					{
						label: 'environment variables',
					},
				],
			},
			{
				label: 'Remotes',
				items: [
					{
						label: 'remotes JSON',
					},
				],
			},
			{
				label: 'Publisher metadata',
				items: [
					{
						label: 'publisherMeta JSON',
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
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.McpServerPackageVersion>
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
	entityType={EntityType.McpServerPackageVersion}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
