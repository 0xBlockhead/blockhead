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
				label: 'observed time/source',
			},
			{
				label: 'last analyzed message time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'canister',
					},
					{
						label: 'observed time/source',
					},
					{
						label: 'last analyzed message time',
					},
					{
						label: 'message count',
					},
					{
						label: 'log visibility',
					},
					{
						label: 'payload availability',
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
					label: 'Messages',
					items: [
						{
							label: 'canister log messages when caller-authorized',
						},
					],
				},
				{
					label: 'Visibility',
					items: [
						{
							label: 'controller/public log visibility context',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'fetch_canister_logs or dashboard payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanisterLog_Timestamp>
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
	entityType={EntityType.IcpCanisterLog_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
