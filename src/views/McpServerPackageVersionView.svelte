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
			'version',
		],
		content: {
			dl: [
				[
					'version',
					'releaseDate',
					'registryStatus',
					'publishedAt',
					'isLatest',
					'packageRegistryType',
					'packageRegistryBaseUrl',
					'packageIdentifier',
					'runtimeHint',
					'transportKind',
					'packages',
					'remotes',
					'packageArguments',
					'runtimeArguments',
					'environmentVariables',
					'publisherMeta',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'documents',
					when: 'open',
					items: [
						'$$documents',
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
