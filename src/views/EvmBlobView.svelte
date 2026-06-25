<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	display: [
		{
			field: 'versionedHash',
			kind: 'truncated',
		},
		{
			field: 'kzgCommitment',
			kind: 'truncated',
		},
	],
	panels: [
		{
			id: 'semantics',
			label: 'Blob semantics',
			kind: 'raw',
			slot: 'BlobSemantics',
		},
	],
	decodes: [
		{
			field: 'blobDataStorageReferences',
			kind: 'json',
			slot: 'BlobStorageReferences',
		},
	],
	closed: [
		'blobIndex',
		'versionedHash',
		'kzgCommitment',
	],
	content: {
		dl: [
			[
				'blobIndex',
				'versionedHash',
				'kzgCommitment',
				{
					label: 'Blobscan storage references',
				},
				'$transaction',
				'$block',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent EVM blob transaction',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing EVM block',
					},
				],
			},
			{
				label: 'Data availability',
				items: [
					'versionedHash',
					'kzgCommitment',
					{
						label: 'storage references',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'execution payload blob versioned hashes',
					},
					{
						label: 'Blobscan blob payload',
					},
				],
			},
		],
	},
	summary: {
		value: 'blobIndex',
		title: 'blobIndex',
		after: [
			'versionedHash',
			'kzgCommitment',
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmBlob>
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
	entityType={EntityType.EvmBlob}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
