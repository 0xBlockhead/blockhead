<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	display: [
		{
			kind: 'code',
			slot: 'ContractBytecode',
		},
	],
	decodes: [
		{
			kind: 'abi',
			slot: 'EvmAbiView',
		},
		{
			kind: 'bytecode',
			slot: 'BytecodeView',
		},
	],
	renderers: [
		{
			slot: 'EvmAbiView',
			component: 'EvmAbiView',
			label: 'ABI renderer',
			for: 'decode',
		},
		{
			slot: 'ContractBytecode',
			component: 'TruncatedValue',
			label: 'contract bytecode renderer',
			for: 'value',
		},
	],
	closed: [
		{
			label: 'chain id',
		},
		{
			label: 'precompile address when applicable',
		},
		{
			label: 'deployer',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'chain id',
				},
				{
					label: 'precompile address when applicable',
				},
				{
					label: 'deployer',
				},
				{
					label: 'creation transaction',
				},
				{
					label: 'implementation contract',
				},
				{
					label: 'inline ABI',
				},
				{
					label: 'bytecode hash',
				},
				{
					label: 'truncated runtime bytecode',
				},
				{
					label: 'verification summary',
				},
				{
					label: 'account address',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'EvmNetworkAccount address/activity/balance context',
					},
				],
			},
			{
				label: 'Creation',
				items: [
					{
						label: 'deployer',
					},
					{
						label: 'creation transaction',
					},
				],
			},
			{
				label: 'Code',
				items: [
					{
						label: 'runtime bytecode',
					},
					{
						label: 'code hash',
					},
					{
						label: 'precompile catalog name',
					},
				],
			},
			{
				label: 'Verification',
				items: [
					{
						label: 'Sourcify-backed EvmContractVerification',
					},
					{
						label: 'EvmContractCompilation',
					},
					{
						label: 'EvmContractSourceBundle',
					},
				],
			},
			{
				label: 'Proxy/storage',
				items: [
					{
						label: 'implementation contract',
					},
					{
						label: 'storage slot reads',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmContract>
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
	entityType={EntityType.EvmContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
