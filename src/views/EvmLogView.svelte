<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	panels: [
		{
			id: 'decode',
			label: 'Decode',
			kind: 'decode',
			slot: 'LogDecodePanel',
		},
	],
	decodes: [
		{
			field: 'data',
			kind: 'eventLog',
			slot: 'EvmLogDecode',
		},
	],
	renderers: [
		{
			slot: 'EvmLogDecode',
			component: 'EvmLogDecode',
			label: 'event log decode renderer',
			for: 'decode',
		},
	],
	closed: [
		{
			label: 'receipt log index',
		},
		{
			label: 'topic0 when topics[0] exists',
		},
		{
			label: 'transaction link',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'receipt log index',
				},
				{
					label: 'topic0 when topics[0] exists',
				},
				{
					label: 'transaction link',
				},
				{
					label: 'emitter contract',
				},
				{
					label: 'topics list with topic links',
				},
				'data',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent transaction and block',
					},
				],
			},
			{
				label: 'Emitter',
				items: [
					{
						label: 'emitter contract',
					},
				],
			},
			{
				label: 'Topics/data',
				items: [
					{
						label: 'topics list',
					},
					{
						label: 'data payload',
					},
					{
						label: 'topic0 catalog signatures',
					},
				],
			},
			{
				label: 'Token transfers',
				items: [
					{
						label: 'token-transfer interpretations of this log',
					},
				],
			},
			{
				label: 'ABI decode',
				items: [
					{
						label: 'emitter ABI from Sourcify/Etherscan when open',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmLog>
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
	entityType={EntityType.EvmLog}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
