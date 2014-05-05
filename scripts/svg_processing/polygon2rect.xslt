<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:svg="http://www.w3.org/2000/svg">
    <xsl:output method="xml" version="1.0" indent="yes" encoding="utf-8" omit-xml-declaration="no"/>

    <xsl:template match="svg:polygon">
        <rect>
            <xsl:attribute name="x"><xsl:value-of select="@points" /></xsl:attribute>
            <!--xsl:attribute name="x"><xsl:value-of select="tokenize(@points,' ')" /></xsl:attribute>
            <xsl:attribute name="y"><xsl:value-of select="@points" /></xsl:attribute>
            <xsl:attribute name="width"></xsl:attribute>
            <xsl:attribute name="height"></xsl:attribute-->
        </rect>
    </xsl:template>

    <xsl:template match="*">
        <xsl:copy>
            <xsl:copy-of select="@*" />
            <xsl:apply-templates />
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
