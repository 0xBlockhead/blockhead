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
				label: 'service provider',
			},
			{
				label: 'request id',
			},
			{
				label: 'requester',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'service provider',
					},
					{
						label: 'request id',
					},
					{
						label: 'requester',
					},
					{
						label: 'request hash',
					},
					{
						label: 'response hash',
					},
					{
						label: 'settlement trace',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Provider',
					items: [
						{
							label: 'parent service provider',
						},
					],
				},
				{
					label: 'Settlement',
					items: [
						{
							label: 'linked settlement trace',
						},
					],
				},
				{
					label: 'Requester',
					items: [
						{
							label: 'requester EVM account when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGServiceRequest>
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
	entityType={EntityType.ZeroGServiceRequest}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
