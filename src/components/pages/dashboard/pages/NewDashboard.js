import React from 'react';
import { Box, Grid, Paper, Typography, Button, ButtonGroup } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const areaData = [
    { name: '01 Nov', expenses: 20, payments: 15 },
    { name: '02 Nov', expenses: 25, payments: 18 },
    { name: '03 Nov', expenses: 22, payments: 20 },
    { name: '04 Nov', expenses: 18, payments: 16 },
    { name: '05 Nov', expenses: 24, payments: 19 },
    { name: '06 Nov', expenses: 26, payments: 21 },
    { name: '07 Nov', expenses: 7, payments: 12 },
    { name: '08 Nov', expenses: 20, payments: 16 },
    { name: '09 Nov', expenses: 28, payments: 22 },
    { name: '10 Nov', expenses: 25, payments: 20 },
    { name: '11 Nov', expenses: 22, payments: 18 },
    { name: '12 Nov', expenses: 26, payments: 21 },
    { name: '13 Nov', expenses: 24, payments: 19 },
    { name: '14 Nov', expenses: 20, payments: 17 }
];

const statsData = [
    { label: 'Visitors', value: '4,107,220', change: '+6.24%', positive: true },
    { label: 'Followers', value: '312,560', change: '-10.76%', positive: false },
    { label: 'Sales', value: '39,680', change: '+20.00%', positive: true },
    { label: 'Leads', value: '91,750', change: '-8.78%', positive: false }
];

const incomeData = [
    { category: 'Business', current: 224, target: 2452, date: '22/02/22' },
    { category: 'Travel', current: 510, target: 7631, date: '22/02/22' },
    { category: 'Design', current: 775, target: 8779, date: '22/02/22' },
    { category: 'Finance', current: 120, target: 2485, date: '22/02/22' },
    { category: 'Development', current: 20, target: 1477, date: '22/02/22' },
    { category: 'Learning', current: 24, target: 4552, date: '22/02/22' },
    { category: 'Products', current: 120, target: 2485, date: '22/02/22' },
    { category: 'Marketing', current: 20, target: 1477, date: '22/02/22' },
    { category: 'Website', current: 24, target: 4552, date: '22/02/22' }
];

const targetData = [
    { name: 'Business', value: 224, color: '#8B5CF6', targetVal: 2452, currentVal2: 775 },
    { name: 'Travel', value: 510, color: '#EF4444', targetVal: 7631, currentVal2: 662 },
    { name: 'Design', value: 775, color: '#3B82F6', targetVal: 8779, currentVal2: 172 },
    { name: 'Finance', value: 120, color: '#F59E0B', targetVal: 2485, currentVal2: 789 },
    { name: 'Material', value: 82, color: '#6B7280', targetVal: 1456, currentVal2: 775 },
    { name: 'Learnings', value: 775, color: '#10B981', targetVal: 8779, currentVal2: 246 },
    { name: 'Videos', value: 120, color: '#EC4899', targetVal: 2485, currentVal2: 889 },
    { name: 'Programs', value: 82, color: '#A855F7', targetVal: 1456, currentVal2: 574 }
];

// Adjusted leadData to produce an average closer to 46%
const leadData = [
    { category: 'Business', current: 1000, target: 2000, date: '22/02/22' }, // 50%
    { category: 'Travel', current: 3000, target: 7000, date: '22/02/22' },   // ~42.8%
    { category: 'Design', current: 3500, target: 9000, date: '22/02/22' },   // ~38.8%
    { category: 'Finance', current: 1500, target: 2500, date: '22/02/22' },  // 60%
    { category: 'Development', current: 600, target: 1500, date: '22/02/22' }, // 40%
    { category: 'Learning', current: 2000, target: 4000, date: '22/02/22' } // 50%
];

const StatCard = ({ label, value, change, positive }) => (
    <Paper
        sx={{
            background: '#ffffff',
            p: 2,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    bgcolor: positive ? '#e6ffee' : '#ffe6e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Typography sx={{
                        fontSize: 20,
                        color: positive ? '#22c55e' : '#ef4444',
                        fontWeight: "bold"
                    }}>
                        {positive ? '↑' : '↓'}
                    </Typography>
                </Box>
                <Box>
                    <Typography sx={{ fontSize: 25, fontWeight: 'bold', color: '#1f2937' }}>
                        {value}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
                        {label}
                    </Typography>
                </Box>
            </Box>
            <Typography sx={{
                fontSize: 14,
                color: positive ? '#22c55e' : '#ef4444',
                fontWeight: 'medium',
                ml: 2,
                whiteSpace: 'nowrap'
            }}>
                {change}
            </Typography>
        </Box>
    </Paper>
);

const CircularProgress = ({ percentage, color, size = 160, strokeWidth = 16, type = 'full' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDasharray = type === 'half' ? circumference / 2 : circumference;
    const strokeDashoffset = type === 'half'
        ? (circumference / 2) * (1 - percentage / 100)
        : circumference * (1 - percentage / 100);

    return (
        <Box sx={{
            position: 'relative',
            display: 'inline-flex',
            width: size,
            height: type === 'half' ? size / 2 : size,
            overflow: 'hidden',
        }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    transform: type === 'half' ? 'rotate(180deg)' : 'rotate(-90deg)',
                    position: 'absolute',
                    top: type === 'half' ? 0 : 'auto'
                }}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={0}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {type === 'full' && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>{percentage}%</Typography>
                </Box>
            )}
        </Box>
    );
};


function NewDashboard() {

    // Calculate lead generation percentages and average
    const leadPercentages = leadData.map(item => (item.current / item.target) * 100);
    const leadAverage = leadPercentages.reduce((sum, val) => sum + val, 0) / leadPercentages.length;
    // Hardcoding to 46 for exact match as per image request.
    // If dynamic calculation based on leadData is preferred, use: const leadAveragePercent = Math.round(leadAverage);
    const leadAveragePercent = 46; 

    // Colors for the lead generation rings, matching the image.
    const leadRingColors = ['#FBBF24', '#3B82F6', '#EF4444', '#8B5CF6']; // Adjusting to match image colors better (Yellow/Orange, Blue, Red, Purple)


    return (
        <Box sx={{ p: 3,width:'100%', bgcolor: '#f9fafb', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
                                Data Graph Analysis
                            </Typography>
                            <ButtonGroup variant="contained" size="small"
                                sx={{
                                    '& .MuiButtonGroup-grouped': {
                                        borderRadius: '8px !important',
                                        borderColor: 'transparent !important',
                                    },
                                    '& .MuiButton-root': {
                                        textTransform: 'none',
                                        padding: '6px 16px',
                                        minWidth: 'unset',
                                    }
                                }}
                            >
                                <Button sx={{ bgcolor: '#374151', '&:hover': { bgcolor: '#4b5563' }, color: 'white' }}>Yearly</Button>
                                <Button sx={{ bgcolor: 'transparent', color: '#6b7280', '&:hover': { bgcolor: '#e5e7eb' } }}>Monthly</Button>
                                <Button sx={{ bgcolor: 'transparent', color: '#6b7280', '&:hover': { bgcolor: '#e5e7eb' } }}>Weekly</Button>
                                <Button sx={{ bgcolor: 'transparent', color: '#6b7280', '&:hover': { bgcolor: '#e5e7eb' } }}>Daily</Button>
                            </ButtonGroup>
                        </Box>
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        domain={[0, 30]}
                                        tickFormatter={(value) => `${value}k`}
                                    />
                                    <defs>
                                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        </linearGradient>
                                        <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="natural"
                                        dataKey="expenses"
                                        stroke="none"
                                        fill="url(#blueGradient)"
                                        strokeWidth={0}
                                    />
                                    <Area
                                        type="natural"
                                        dataKey="payments"
                                        stroke="none"
                                        fill="url(#pinkGradient)"
                                        strokeWidth={0}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, bgcolor: '#ec4899', borderRadius: '50%' }} />
                                <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Payments</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 12, height: 12, bgcolor: '#3b82f6', borderRadius: '50%' }} />
                                <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Expenses</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        {statsData.map((stat, index) => (
                            <Grid item xs={12} key={index}>
                                <StatCard {...stat} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
                                Income Overview
                            </Typography>
                            <Button size="small" sx={{ minWidth: 'unset', padding: 0, '& .MuiButton-endIcon': { ml: 0.5 } }} endIcon={<Typography sx={{ fontWeight: 'bold', fontSize: 16, color: '#6b7280' }}>...</Typography>}>
                            </Button>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <CircularProgress percentage={86} color="#8b5cf6" size={100} strokeWidth={10} type="full" />
                            <Box>
                                <Typography fontSize={12} color="#6b7280">Total Income</Typography>
                                <Typography fontSize={24} fontWeight="bold" color="#1f2937">$ 9,210.00</Typography>
                                <Typography fontSize={12} color="#22c55e" fontWeight="medium">+2.36%</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ '& > div:not(:last-of-type)': { borderBottom: '1px solid #e5e7eb' }, mt: 2 }}>
                            {incomeData.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                    <Typography sx={{ fontSize: 12, color: '#1f2937', fontWeight: 'medium' }}>
                                        {item.category}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{item.current}</Typography>
                                        <Typography sx={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937' }}>{item.target}</Typography>
                                        <Typography sx={{ fontSize: 10, color: '#6b7280' }}>{item.date}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Monthly Target */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography sx={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
                                Monthly Target
                            </Typography>
                            <Button size="small" sx={{ minWidth: 'unset', padding: 0, '& .MuiButton-endIcon': { ml: 0.5 } }} endIcon={<Typography sx={{ fontWeight: 'bold', fontSize: 16, color: '#6b7280' }}>...</Typography>}>
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={3}>
                            <Box sx={{ position: 'relative', width: 180, height: 90, overflow: 'hidden' }}>
                                <CircularProgress percentage={87} color="#3b82f6" size={180} strokeWidth={16} type="half" />
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -10%)',
                                    textAlign: 'center',
                                }}>
                                    <Typography fontSize={44} fontWeight={600} color="#1f2937" lineHeight={1.6}>87%</Typography>
                                </Box>
                            </Box>
                            <Box textAlign="center" mt={0.5}>
                                <Typography fontSize={11} color="#6b7280" maxWidth="60%" mx="auto">
                                    You nearly reached your monthly target. Target in design category.
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ '& > div:not(:last-of-type)': { borderBottom: '1px solid #e5e7eb' }, mt: 2 }}>
                            {targetData.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, bgcolor: item.color, borderRadius: '50%' }} />
                                        <Typography sx={{ fontSize: 14, color: '#1f2937', fontWeight: 'medium', minWidth: '80px' }}>
                                            {item.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: 14, color: '#6b7280', textAlign: 'right', minWidth: '40px' }}>{item.value}</Typography>
                                        <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', minWidth: '50px' }}>
                                            {item.targetVal}
                                        </Typography>
                                        <Typography sx={{ fontSize: 14, color: '#6b7280', textAlign: 'right', minWidth: '40px' }}>
                                            {item.currentVal2}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
                Lead Generations
            </Typography>
            <Button size="small" sx={{ minWidth: 'unset', padding: 0 }} endIcon={
                <Typography sx={{ fontWeight: 'bold', fontSize: 20, color: '#6b7280' }}>...</Typography>
            } />
        </Box>

        {/* 🔁 Bigger Dynamic SVG Rings with thin lines */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(90deg)' }}>
                    {leadData.slice(0, 4).map((item, index) => {
                        const strokeW = 5;
                        const gap = 4;
                        const baseRadius = 90;
                        const radius = baseRadius - index * (strokeW + gap);
                        const percent = item.current / item.target;
                        const strokeColor = leadRingColors[index % leadRingColors.length];
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference * (1 - percent);

                        return (
                            <circle
                                key={index}
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke={strokeColor}
                                strokeWidth={strokeW}
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                            />
                        );
                    })}
                </svg>
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                    <Typography sx={{ fontSize: 34, fontWeight: 'bold', color: '#1f2937' }}>{leadAveragePercent}%</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center',  }}>
                        <Typography sx={{ fontSize: 14, color: '#6b7280' }}>Average</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: leadAveragePercent > 40 ? '#22c55e' : '#ef4444', ml: 0.5 }}>
                            {leadAveragePercent > 40 ? '↑' : '↓'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>

        {/* 💡 Enlarged list with Dynamic Percentages and arrows */}
        <Box sx={{ '& > div:not(:last-of-type)': { borderBottom: '1px solid #e5e7eb' }, mt: 2 }}>
            {leadData.map((item, index) => {
                const percent = Math.round((item.current / item.target) * 100);
                const isPositive = percent >= 40;
                return (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography sx={{ fontSize: 14, color: '#1f2937', fontWeight: 'medium' }}>
                            {item.category}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 13, color: '#6b7280' }}>{item.current}</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 'bold', color: '#1f2937' }}>{item.target}</Typography>
                            <Typography sx={{ fontSize: 11, color: '#6b7280' }}>{item.date}</Typography>
                            <Typography sx={{ fontSize: 11, color: isPositive ? '#22c55e' : '#ef4444' }}>
                                {percent}% {isPositive ? '▲' : '▼'}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    </Paper>
</Grid>

            </Grid>
        </Box>
    );
}

export default NewDashboard;