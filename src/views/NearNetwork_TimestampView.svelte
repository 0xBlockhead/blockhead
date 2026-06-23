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
				label: 'observed time',
			},
			'source',
			{
				label: 'head height/hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'observed time',
					},
					'source',
					{
						label: 'head height/hash',
					},
					{
						label: 'epoch',
					},
					{
						label: 'gas price',
					},
					{
						label: 'validator counts',
					},
					{
						label: 'protocol versions',
					},
					{
						label: 'node version',
					},
					'syncing',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent NEAR network',
						},
					],
				},
				{
					label: 'Head/epoch',
					items: [
						{
							label: 'head height/hash',
						},
						{
							label: 'epoch id/height/start',
						},
					],
				},
				{
					label: 'Gas/protocol',
					items: [
						{
							label: 'gas price',
						},
						{
							label: 'protocol versions',
						},
						{
							label: 'node version',
						},
					],
				},
				{
					label: 'Validators',
					items: [
						{
							label: 'current/next validator counts',
						},
						{
							label: 'proposal count',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'JSON-RPC status/gas/validators payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearNetwork_Timestamp>
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
	entityType={EntityType.NearNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
