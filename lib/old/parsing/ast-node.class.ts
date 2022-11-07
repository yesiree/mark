import { AstChildNode } from './ast-child-node.class'

export interface AstNode {
  children: AstChildNode[]
  isOpen: boolean
}
