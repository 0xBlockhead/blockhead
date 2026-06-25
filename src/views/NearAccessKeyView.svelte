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
		'$account',
		'publicKey',
		{
			label: 'latest nonce/permission summary',
		},
	],
	content: {
		dl: [
			[
				'$account',
				'publicKey',
				{
					label: 'latest nonce/permission summary',
				},
			],
			[
				{
					label: 'latest function-call scope when implemented',
				},
				{
					label: 'latest observation time',
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
						label: 'parent NEAR account',
					},
				],
			},
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped access-key state observations',
					},
				],
			},
			{
				label: 'Function-call scope',
				items: [
					{
						label: 'receiver',
					},
					{
						label: 'method names',
					},
					{
						label: 'allowance when resolved',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'NEAR transactions scoped by signer/public key when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'view_access_key',
					},
					{
						label: 'view_access_key_list',
					},
					{
						label: 'access-key change queries when wired',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearAccessKey>
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
	entityType={EntityType.NearAccessKey}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
