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
		'$namespace',
		'height',
		'commitment',
	],
	content: {
		dl: [
			[
				'$namespace',
				'height',
				'commitment',
				'sizeBytes',
				'shareVersion',
				'index',
				'txHash',
			],
			[
				'$block',
				{
					label: 'proof availability',
				},
				'payloadRequested',
				'signer',
				'dataHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Namespace',
				items: [
					{
						label: 'parent Celestia namespace',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing Celestia block',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'blob bytes only when explicitly requested',
					},
					{
						label: 'size/hash summary otherwise',
					},
				],
			},
			{
				label: 'Proof',
				items: [
					{
						label: 'share proof JSON when source endpoint returns it',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'blob.Get/GetAll',
					},
					{
						label: 'state-submitted PayForBlobs tx evidence',
					},
					{
						label: 'node height/head freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaBlob>
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
	entityType={EntityType.CelestiaBlob}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
