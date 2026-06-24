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
			label: 'validator',
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
					label: 'validator',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'connected status',
				},
				{
					label: 'uptime percent',
				},
				{
					label: 'validator set kind',
				},
				{
					label: 'observed stake',
				},
				{
					label: 'observed delegator count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Validator',
				items: [
					{
						label: 'parent validation interval',
					},
				],
			},
			{
				label: 'Liveness',
				items: [
					{
						label: 'connected status',
					},
					{
						label: 'uptime percent',
					},
				],
			},
			{
				label: 'Set membership',
				items: [
					{
						label: 'current/pending validator set context',
					},
					{
						label: 'observed stake/delegator count',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Avalanche Info uptime response',
					},
					{
						label: 'PlatformVM validator-set payload',
					},
					{
						label: 'Avascan validator payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheValidator_Timestamp>
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
	entityType={EntityType.AvalancheValidator_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
