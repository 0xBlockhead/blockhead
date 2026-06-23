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
				label: 'metadata',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'metadata',
					},
					{
						label: 'observation time',
					},
					'source',
					'visibility',
					{
						label: 'content hash',
					},
					{
						label: 'content type',
					},
					{
						label: 'value size',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Metadata',
					items: [
						{
							label: 'parent metadata section',
						},
					],
				},
				{
					label: 'Canister',
					items: [
						{
							label: 'parent ICP canister through metadata',
						},
					],
				},
				{
					label: 'Decoded value',
					items: [
						{
							label: 'Candid/service metadata or text/blob preview',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'certified metadata',
						},
						{
							label: 'custom-section',
						},
						{
							label: 'or dashboard payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanisterMetadata_Timestamp>
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
	entityType={EntityType.IcpCanisterMetadata_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
