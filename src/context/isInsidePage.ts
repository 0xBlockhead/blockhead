import { useGetSetContext } from '$/context/useContext.ts'

const {
	get: getIsInsidePage,
	set: setIsInsidePage,
} = useGetSetContext<boolean>(
	Symbol('isInsidePage')
)

const {
	get: getIsPageRoot,
	set: setIsPageRoot,
} = useGetSetContext<boolean>(
	Symbol('isPageRoot')
)

export {
	getIsInsidePage,
	getIsPageRoot,
	setIsInsidePage,
	setIsPageRoot,
}
