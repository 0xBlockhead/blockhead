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
				label: 'reverse record',
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
						label: 'reverse record',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'verified flag',
					},
					{
						label: 'reverse resolver selector',
					},
					{
						label: 'forward resolver selector',
					},
					{
						label: 'check result',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Reverse record',
					items: [
						{
							label: 'parent ENS reverse record',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'linked account',
						},
					],
				},
				{
					label: 'Name',
					items: [
						{
							label: 'claimed ENS name',
						},
					],
				},
				{
					label: 'Raw evidence',
					items: [
						{
							label: 'resolver calls',
						},
						{
							label: 'block/source context',
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsReverseRecord_Timestamp>
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
	entityType={EntityType.EnsReverseRecord_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
