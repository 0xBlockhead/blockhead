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
				label: 'namespace id',
			},
			{
				label: 'version',
			},
			{
				label: 'latest blob count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'namespace id',
					},
					{
						label: 'namespace version',
					},
					'label',
					{
						label: 'latest blob count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Blob count snapshots',
					items: [
						{
							label: 'timestamped namespace activity observations',
						},
					],
				},
				{
					label: 'Blobs',
					items: [
						{
							label: 'Celestia blobs filtered by namespace',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Celestia network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'namespace-id parsing',
						},
						{
							label: 'blob.GetAll namespace queries',
						},
						{
							label: 'configured namespace labels when present',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNamespace>
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
	entityType={EntityType.CelestiaNamespace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
