import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const AuthRouteLogT = (props) => {
    const { log, component: Component, ...rest } = props
    return (
        <Route
            {...rest}
            render={props => {
                if (log.isAuthenticated) {
                    return <Component {...props} />
                }
                else
                {
                    return <Redirect to="/login" />
                }      
            }}
        />
    )
}
const mapStateToProps = (state) => ({
    log: state.log
})
export default connect(mapStateToProps)(AuthRouteLogT)