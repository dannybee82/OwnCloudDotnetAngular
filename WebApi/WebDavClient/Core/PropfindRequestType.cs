﻿namespace WebDav
{
    /// <summary>
    /// Specifies a type of PROPFIND request.
    /// AllProperties: 'allprop' + 'include'.
    /// NamedProperties: 'prop'.
    /// AllPropertiesImplied: no body.
    /// </summary>
    public enum PropfindRequestType
    {
        AllProperties,
        NamedProperties,
        AllPropertiesImplied,
    }
}
