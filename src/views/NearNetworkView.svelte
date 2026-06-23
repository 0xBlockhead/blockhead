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
			'slug',
			'name',
			'environment',
		],
		content: {
			dl: [
				[
					'slug',
					'name',
					'environment',
					{
						label: 'head block',
					},
					{
						label: 'native asset count',
					},
					{
						label: 'epoch',
					},
					{
						label: 'protocol version',
					},
					{
						label: 'validator counts',
					},
					{
						label: 'gas price',
					},
					{
						label: 'network snapshots',
					},
					{
						label: 'validators',
					},
					{
						label: 'endpoints',
					},
					{
						label: 'native assets',
					},
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Blocks',
					items: [
						{
							label: 'NearBlock list',
						},
					],
				},
				{
					label: 'Validators',
					items: [
						{
							label: 'NearValidator list',
						},
					],
				},
				{
					label: 'Network snapshots',
					items: [
						{
							label: 'NearNetwork_Timestamp list',
						},
					],
				},
				{
					label: 'Endpoints/resources',
					items: [
						{
							label: 'RPC endpoints',
						},
						{
							label: 'native assets',
						},
						{
							label: 'faucets',
						},
						{
							label: 'block explorers',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearNetwork>
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
	entityType={EntityType.NearNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
