type LayoutProps = {
    children: React.ReactNode
}

export default function Container({ children }: LayoutProps){
    return (
        <div className="max-w-6xl mt-24 m-auto">
            {children}  
        </div>
    )
} 