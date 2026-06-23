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
				label: 'observed time/source',
			},
			{
				label: 'latest archived height/time',
			},
			{
				label: 'validator count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'observed time/source',
					},
					{
						label: 'latest archived height/time',
					},
					{
						label: 'validator count',
					},
					{
						label: 'token count',
					},
					{
						label: 'migration record count',
					},
					{
						label: 'archive coverage status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent BNB Beacon network',
						},
					],
				},
				{
					label: 'Archive coverage',
					items: [
						{
							label: 'latest archived height/time',
						},
						{
							label: 'archive coverage status',
						},
					],
				},
				{
					label: 'Catalog counts',
					items: [
						{
							label: 'validator count',
						},
						{
							label: 'token count',
						},
						{
							label: 'migration record count',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'API/explorer/archive freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconNetwork_Timestamp>
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
	entityType={EntityType.BnbBeaconNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
