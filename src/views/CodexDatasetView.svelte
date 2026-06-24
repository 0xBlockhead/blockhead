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
			label: 'CID',
		},
		{
			label: 'tree CID',
		},
		{
			label: 'dataset size',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'CID',
				},
				{
					label: 'tree CID',
				},
				{
					label: 'dataset size',
				},
				{
					label: 'block size',
				},
				'filename',
				'mimetype',
				{
					label: 'local copy count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Local copies',
				items: [
					{
						label: 'BlockheadCodexStoredData list',
					},
				],
			},
			{
				label: 'Manifest',
				items: [
					{
						label: 'manifest fields from /data or /data/{cid}/network/manifest',
					},
				],
			},
			{
				label: 'Download',
				items: [
					{
						label: 'BlockheadCodexStoredData_Timestamp download/availability history',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Codex REST DataItem/ManifestItem payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CodexDataset>
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
	entityType={EntityType.CodexDataset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
