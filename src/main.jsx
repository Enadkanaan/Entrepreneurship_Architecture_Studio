import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {FrameworkProvider} from './lib/context';
import './styles.css';
class ErrorBoundary extends React.Component{state={error:null};static getDerivedStateFromError(error){return {error};}render(){if(this.state.error)return <main className="fatal"><h1>The workspace encountered an error.</h1><p>Your saved data has not been deleted. Reload to retry.</p><pre>{this.state.error.message}</pre><button onClick={()=>location.reload()}>Reload</button></main>;return this.props.children;}}
createRoot(document.getElementById('root')).render(<ErrorBoundary><FrameworkProvider><App/></FrameworkProvider></ErrorBoundary>);
