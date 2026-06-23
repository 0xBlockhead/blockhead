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
				label: 'canister',
			},
			{
				label: 'metadata name',
			},
			{
				label: 'latest visibility',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'canister',
					},
					{
						label: 'metadata name',
					},
					{
						label: 'latest visibility',
					},
					{
						label: 'latest content hash',
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
					label: 'Canister',
					items: [
						{
							label: 'parent ICP canister',
						},
					],
				},
				{
					label: 'Metadata history',
					items: [
						{
							label: 'timestamped metadata observations',
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
					label: 'Methods',
					items: [
						{
							label: 'method rows when metadata contains Candid service',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'certified canister metadata or custom-section payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanisterMetadata>
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
	entityType={EntityType.IcpCanisterMetadata}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
